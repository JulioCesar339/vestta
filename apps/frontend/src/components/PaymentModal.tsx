import { useState } from 'react'
import styles from './PaymentModal.module.css'

interface Props {
  total: number
  onConfirm: () => Promise<void>
  onCancel: () => void
}

interface CardForm {
  number: string
  name: string
  expiry: string
  cvv: string
}

interface CardErrors {
  number?: string
  name?: string
  expiry?: string
  cvv?: string
}

export default function PaymentModal({ total, onConfirm, onCancel }: Props) {
  const [form, setForm] = useState<CardForm>({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  })
  const [errors, setErrors] = useState<CardErrors>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function handleChange(field: keyof CardForm, value: string) {
    if (field === 'number') {
      value = value
        .replace(/\D/g, '')
        .slice(0, 16)
        .replace(/(.{4})/g, '$1 ')
        .trim()
    }
    if (field === 'expiry') {
      value = value
        .replace(/\D/g, '')
        .slice(0, 4)
        .replace(/(.{2})/, '$1/')
    }
    if (field === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 3)
    }
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function validate(): boolean {
    const newErrors: CardErrors = {}
    if (form.number.replace(/\s/g, '').length !== 16) {
      newErrors.number = 'Número de tarjeta inválido'
    }
    if (form.name.trim().length < 3) {
      newErrors.name = 'Ingresa el nombre del titular'
    }
    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) {
      newErrors.expiry = 'Formato inválido (MM/AA)'
    }
    if (form.cvv.length !== 3) {
      newErrors.cvv = 'CVV inválido'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handlePay() {
    if (!validate()) return
    setLoading(true)
    try {
      await onConfirm()
      setSuccess(true)
    } catch {
      setErrors({ number: 'Error al procesar el pago, intenta de nuevo' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {success ? (
          <div className={styles.success}>
            <span className={styles.successIcon}>✓</span>
            <h3 className={styles.successTitle}>¡Pago exitoso!</h3>
            <p className={styles.successMsg}>
              Tu pedido ha sido procesado correctamente.
            </p>
          </div>
        ) : (
          <>
            <h2 className={styles.title}>Datos de pago</h2>
            <div className={styles.form}>
              <div className={styles.total}>
                <span>Total a pagar</span>
                <span className={styles.totalAmount}>${total.toFixed(2)}</span>
              </div>

              <div className={styles.field}>
                <label htmlFor="card-number" className={styles.label}>
                  Número de tarjeta
                </label>
                <input
                  id="card-number"
                  className={`${styles.input} ${errors.number ? styles.inputError : ''}`}
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={form.number}
                  onChange={(e) => handleChange('number', e.target.value)}
                />
                {errors.number && (
                  <span className={styles.errorMsg}>{errors.number}</span>
                )}
              </div>

              <div className={styles.field}>
                <label htmlFor="card-name" className={styles.label}>
                  Nombre del titular
                </label>
                <input
                  id="card-name"
                  className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                  type="text"
                  placeholder="Como aparece en la tarjeta"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                />
                {errors.name && (
                  <span className={styles.errorMsg}>{errors.name}</span>
                )}
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="card-expiry" className={styles.label}>
                    Fecha de vencimiento
                  </label>
                  <input
                    id="card-expiry"
                    className={`${styles.input} ${errors.expiry ? styles.inputError : ''}`}
                    type="text"
                    placeholder="MM/AA"
                    value={form.expiry}
                    onChange={(e) => handleChange('expiry', e.target.value)}
                  />
                  {errors.expiry && (
                    <span className={styles.errorMsg}>{errors.expiry}</span>
                  )}
                </div>

                <div className={styles.field}>
                  <label htmlFor="card-cvv" className={styles.label}>
                    CVV
                  </label>
                  <input
                    id="card-cvv"
                    className={`${styles.input} ${errors.cvv ? styles.inputError : ''}`}
                    type="text"
                    placeholder="123"
                    value={form.cvv}
                    onChange={(e) => handleChange('cvv', e.target.value)}
                  />
                  {errors.cvv && (
                    <span className={styles.errorMsg}>{errors.cvv}</span>
                  )}
                </div>
              </div>

              <div className={styles.buttons}>
                <button className={styles.cancelBtn} onClick={onCancel}>
                  Cancelar
                </button>
                <button
                  className={styles.payBtn}
                  onClick={handlePay}
                  disabled={loading}
                >
                  {loading ? 'Procesando...' : 'Confirmar pago'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
