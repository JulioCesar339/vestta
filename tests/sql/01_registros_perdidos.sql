-- PATRÓN 1: Órdenes sin items (registros perdidos)
-- Detecta órdenes que se crearon pero no tienen productos asociados
-- En un sistema real esto indica que el proceso batch falló a la mitad

SELECT 
    o.id AS orden_id,
    o.user_id,
    o.total,
    o.status,
    o.created_at
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE oi.order_id IS NULL;