-- PATRÓN 3: Reconciliación de montos
-- Compara el total declarado en cada orden contra la suma real de sus items
-- Una diferencia indica corrupción de datos o error en el cálculo del batch

SELECT
    o.id AS orden_id,
    o.total AS total_declarado,
    SUM(oi.quantity * oi.unit_price) AS total_calculado,
    o.total - SUM(oi.quantity * oi.unit_price) AS diferencia
FROM orders o
INNER JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, o.total
HAVING ABS(o.total - SUM(oi.quantity * oi.unit_price)) > 0.01;