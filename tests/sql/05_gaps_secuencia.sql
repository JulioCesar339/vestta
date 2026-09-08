-- PATRÓN 5: Gaps en la secuencia de órdenes
-- Detecta IDs faltantes que indican registros eliminados o perdidos durante el batch
-- En banca esto es crítico: cada transacción debe tener trazabilidad completa

SELECT
    id + 1 AS id_faltante_desde,
    (
        SELECT MIN(id) - 1
        FROM orders o2
        WHERE o2.id > o1.id
    ) AS id_faltante_hasta
FROM orders o1
WHERE NOT EXISTS (
    SELECT 1 FROM orders o2 WHERE o2.id = o1.id + 1
)
AND id < (SELECT MAX(id) FROM orders);