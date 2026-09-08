-- PATRÓN 4A: Órdenes COMPLETADAS sin fecha de cierre
-- Una orden completada siempre debe tener completed_at

SELECT
    id AS orden_id,
    user_id,
    total,
    status,
    created_at,
    completed_at
FROM orders
WHERE status = 'COMPLETADO'
  AND completed_at IS NULL;

-- PATRÓN 4B: Órdenes RECHAZADAS con items asociados
-- Una orden rechazada no debería tener productos procesados

SELECT
    o.id AS orden_id,
    o.status,
    o.total,
    COUNT(oi.id) AS items_asociados
FROM orders o
INNER JOIN order_items oi ON o.id = oi.order_id
WHERE o.status = 'RECHAZADO'
GROUP BY o.id, o.status, o.total;