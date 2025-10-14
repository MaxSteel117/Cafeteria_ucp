// app/api/pedidos/route.ts
import { type NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth";

// FUNCIÓN GET CORREGIDA para listar pedidos
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const estado = searchParams.get("estado");

    // ✅ CONSULTA CORREGIDA: Une las 3 tablas (pedidos -> detalle_pedido -> productos)
    let query = `
      SELECT 
        p.id as pedido_id,
        p.fecha_pedido,
        p.estado,
        p.total,
        u.nombre as usuario_nombre,
        pr.nombre as producto_nombre,
        pr.imagen as producto_imagen,
        dp.cantidad,
        dp.precio_unitario,
        dp.notas
      FROM pedidos p
      JOIN usuarios u ON p.id_usuario = u.id
      JOIN detalle_pedido dp ON p.id = dp.id_pedido
      JOIN productos pr ON dp.id_producto = pr.id
    `;
    const params: any[] = [];

    // Lógica de filtrado (ya estaba bien)
    if (decoded.rol !== "admin") {
      query += " WHERE p.id_usuario = ?";
      params.push(decoded.userId);
    }

    if (estado) {
      query += params.length > 0 ? " AND p.estado = ?" : " WHERE p.estado = ?";
      params.push(estado);
    }

    query += " ORDER BY p.fecha_pedido DESC";

    const [pedidos] = await pool.execute(query, params);

    return NextResponse.json(pedidos);
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// FUNCIÓN POST CORREGIDA para crear un pedido con su detalle
export async function POST(request: NextRequest) {
  const connection = await pool.getConnection(); // Obtener una conexión para la transacción

  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const { id_producto, cantidad, notas } = await request.json();

    if (!id_producto || !cantidad) {
      return NextResponse.json(
        { error: "Producto y cantidad son requeridos" },
        { status: 400 }
      );
    }

    // ✅ INICIO DE LA TRANSACCIÓN
    await connection.beginTransaction();

    // 1. Obtener el precio del producto
    const [productos] = await connection.execute(
      "SELECT precio FROM productos WHERE id = ? AND disponible = TRUE",
      [id_producto]
    );
    const productArray = productos as any[];
    if (productArray.length === 0) {
      await connection.rollback(); // Cancelar transacción si el producto no existe
      return NextResponse.json(
        { error: "Producto no encontrado o no disponible" },
        { status: 404 }
      );
    }
    const precioUnitario = productArray[0].precio;
    const total = precioUnitario * cantidad;

    // 2. Crear el registro en la tabla `pedidos`
    const [pedidoResult] = await connection.execute(
      "INSERT INTO pedidos (id_usuario, total, estado) VALUES (?, ?, ?)",
      [decoded.userId, total, "pendiente"]
    );
    const pedidoId = (pedidoResult as any).insertId;

    // 3. Crear el registro en la tabla `detalle_pedido`
    await connection.execute(
      "INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario, notas) VALUES (?, ?, ?, ?, ?)",
      [pedidoId, id_producto, cantidad, precioUnitario, notas || null]
    );

    // ✅ CONFIRMAR LA TRANSACCIÓN
    await connection.commit();

    return NextResponse.json(
      { message: "Pedido creado exitosamente", pedidoId: pedidoId },
      { status: 201 }
    );
  } catch (error) {
    // Si algo falla, revertir todos los cambios
    await connection.rollback();
    console.error("Error al crear pedido:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  } finally {
    // Liberar la conexión para que otros puedan usarla
    connection.release();
  }
}