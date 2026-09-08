-- PATRÓN 2: Órdenes duplicadas
-- Detecta órdenes del mismo usuario, mismo total y mismo minuto
-- En un sistema real indica que el batch procesó el mismo registro dos veces

SELECT 
    user_id,
    total,
    strftime('%Y-%m-%d %H:%M', created_at) AS minuto,
    COUNT(*) AS total_duplicados,
    SUM(total) AS monto_cobrado_de_mas
FROM orders
GROUP BY user_id, total, strftime('%Y-%m-%d %H:%M', created_at)
HAVING COUNT(*) > 1;