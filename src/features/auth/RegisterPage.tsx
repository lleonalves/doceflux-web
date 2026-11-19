import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { useAuthStore } from '../../store/useAuthStore'
import { getRegisterErrorMessage, register as registerStore } from './authApi'

const today = () => new Date().toISOString().slice(0, 10)

const registerSchema = z.object({
  storeName: z.string().trim().min(1, 'Nome da confeitaria é obrigatório').max(150, 'Máximo de 150 caracteres'),
  mainManager: z.string().trim().min(1, 'Nome do responsável é obrigatório').max(120, 'Máximo de 120 caracteres'),
  responsibleManager: z.string().trim().min(1, 'Gestor responsável é obrigatório').max(120, 'Máximo de 120 caracteres'),
  companyStartDate: z
    .string()
    .min(1, 'Data de início é obrigatória')
    .refine((value) => value <= today(), 'A data não pode ser futura'),
  email: z.email('E-mail inválido').max(150, 'Máximo de 150 caracteres'),
  password: z.string().min(6, 'Mínimo de 6 caracteres').max(100, 'Máximo de 100 caracteres'),
})

type RegisterFormValues = z.infer<typeof registerSchema>

const inputClass = 'min-h-11 w-full rounded-xl border-2 border-cacao bg-cream px-3 py-2'
const labelClass = 'block text-sm font-bold text-cacao'
const errorClass = 'text-sm font-bold text-rose-deep'

export function RegisterPage() {
  const setAuth = useAuthStore((state) => state.setAuth)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) })

  const mutation = useMutation({
    mutationFn: registerStore,
    onSuccess: ({ token, user }) => setAuth(token, user), // PublicOnly redireciona para a área logada
  })

  const fields: { name: keyof RegisterFormValues; label: string; type?: string; autoComplete?: string }[] = [
    { name: 'storeName', label: 'Nome da Confeitaria' },
    { name: 'mainManager', label: 'Nome do Responsável', autoComplete: 'name' },
    { name: 'responsibleManager', label: 'Gestor Responsável' },
    { name: 'companyStartDate', label: 'Início da empresa', type: 'date' },
    { name: 'email', label: 'E-mail', type: 'email', autoComplete: 'email' },
    { name: 'password', label: 'Senha', type: 'password', autoComplete: 'new-password' },
  ]

  return (
    <main className="flex min-h-svh items-center justify-center bg-cream p-4">
      <form
        onSubmit={handleSubmit((values) => {
          if (mutation.isPending) return
          mutation.mutate(values)
        })}
        noValidate
        className="w-full max-w-sm space-y-4 rounded-2xl border-2 border-cacao bg-beige p-6 shadow-cozy"
      >
        <h1 className="text-3xl font-bold text-rose-deep">Cadastre sua confeitaria</h1>

        {mutation.isError && (
          <p role="alert" className="rounded-xl border-2 border-cacao bg-cream p-3 text-sm font-bold text-rose-deep">
            {getRegisterErrorMessage(mutation.error)}
          </p>
        )}

        {fields.map(({ name, label, type = 'text', autoComplete }) => (
          <div key={name} className="space-y-1">
            <label htmlFor={name} className={labelClass}>
              {label}
            </label>
            <input
              id={name}
              type={type}
              autoComplete={autoComplete}
              max={type === 'date' ? today() : undefined}
              className={inputClass}
              {...register(name)}
            />
            {errors[name] && (
              <p role="alert" className={errorClass}>
                {errors[name].message}
              </p>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="min-h-11 w-full rounded-xl border-2 border-cacao bg-rose-deep px-4 py-2 font-bold text-cream shadow-cozy-sm transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {mutation.isPending ? 'Criando conta...' : 'Criar conta'}
        </button>

        <p className="text-center text-sm text-cacao">
          Já tem conta?{' '}
          <Link to="/login" className="font-bold text-rose-deep underline">
            Entrar
          </Link>
        </p>
      </form>
    </main>
  )
}
