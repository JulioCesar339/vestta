# SQL Validation Queries — Vestta QA Portfolio

Queries de validación diseñadas para simular validaciones ejecutadas por un **QA Tester en procesos batch de entornos bancarios y transaccionales**.

Cada script está orientado a detectar un tipo específico de defecto o inconsistencia de datos sobre las tablas `orders`, `order_items`, `products` y `users`.

## Patrones implementados

| Script                         | Patrón SQL                               | Qué detecta                                                                          |
| ------------------------------ | ---------------------------------------- | ------------------------------------------------------------------------------------ |
| `01_registros_perdidos.sql`    | `LEFT JOIN` + `IS NULL`                  | Órdenes sin items asociados                                                          |
| `02_duplicados.sql`            | `GROUP BY` + `HAVING`                    | Posibles órdenes duplicadas por usuario, monto y minuto                              |
| `03_reconciliacion_montos.sql` | Subqueries + `ABS`                       | Diferencias entre el total declarado y la suma real de los items                     |
| `04_integridad_estados.sql`    | `INNER JOIN` + condiciones de validación | Inconsistencias de estado, como órdenes COMPLETADAS sin fecha o RECHAZADAS con items |
| `05_gaps_secuencia.sql`        | `NOT EXISTS`                             | Gaps inesperados en la secuencia de IDs de órdenes                                   |

## Cómo ejecutar

```bash
# Ejecutar una query específica
sqlite3 apps/backend/vestta.db < tests/sql/01_registros_perdidos.sql

# Ejecutar todas las queries
for f in tests/sql/*.sql; do
  echo "--- $f ---"
  sqlite3 apps/backend/vestta.db < "$f"
done
```

## Datos de prueba

El seed de la base de datos incluye **defectos intencionales** para validar el comportamiento de cada query:

* Orden `COMPLETADA` sin `completed_at`
* Órdenes potencialmente duplicadas en el mismo minuto
* Orden `RECHAZADA` con items procesados
* Diferencia entre el total declarado de una orden y la suma de sus items
* Gaps intencionales en la secuencia de IDs

El objetivo es demostrar cómo SQL puede utilizarse como mecanismo de **validación de integridad, reconciliación y detección de anomalías de datos dentro de procesos QA**.
