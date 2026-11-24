import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { CircleCheck, KeyRound, Store, TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Card } from '../../../components/ui/Card'
import { shouldRetry } from '../../../lib/queryRetry'
import { useAuthStore } from '../../../store/useAuthStore'
import { getProfile, updatePassword, updateProfile } from '../services/settingsService'
import type { Profile } from '../types'

const profileSchema = z.object({
  storeName: z.string().trim().min(1, 'Nome da confeitaria é obrigatório').max(150, 'Máximo de 150 caracteres'),
  mainManager: z.string().trim().min(1, 'Gestor principal é obrigatório').max(120, 'Máximo de 120 caracteres'),
  responsibleManager: z.string().trim().min(1, 'Gestor responsável é obrigatório').max(120, 'Máximo de 120 caracteres'),
})

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Informe a senha atual'),
    newPassword: z.string().min(8, 'Mínimo de 8 caracteres').max(100, 'Máximo de 100 caracteres'),
    confirmPassword: z.string().min(1, 'Confirme a nova senha'),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não coincidem',
  })

type ProfileFormValues = z.infer<typeof profileSchema>
type PasswordFormValues = z.infer<typeof passwordSchema>

const inputClass =
  'rounded-lg border-2 border-cacao bg-cream px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-soft disabled:cursor-not-allowed disabled:bg-beige disabled:text-cacao/70'
const primaryButtonClass =
  'min-h-11 rounded-xl border-2 border-cacao bg-rose-deep px-4 font-bold text-cream shadow-cozy-sm transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-60'

function apiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<{ detail?: string }>(error)) {
    return error.response?.data?.detail ?? fallback
  }
  return fallback
}

function ErrorAlert({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-lg border-2 border-cacao bg-rose-soft/20 px-3 py-2 text-sm font-bold text-rose-deep"
    >
      <TriangleAlert size={18} strokeWidth={2.5} aria-hidden="true" className="mt-0.5 shrink-0" />
      <p className="min-w-0 break-words">{message}</p>
    </div>
  )
}

function SuccessAlert({ message }: { message: string }) {
  return (
    <div
      role="status"
      className="flex items-start gap-2 rounded-lg border-2 border-cacao bg-sage/20 px-3 py-2 text-sm font-bold text-sage-dark"
    >
      <CircleCheck size={18} strokeWidth={2.5} aria-hidden="true" className="mt-0.5 shrink-0" />
      <p className="min-w-0 break-words">{message}</p>
    </div>
  )
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-bold">
        {label}
      </label>
      {children}
      {error && <span className="text-xs text-rose-deep">{error}</span>}
    </div>
  )
}

function SettingsSkeleton() {
  return (
    <div aria-hidden="true" className="flex animate-pulse flex-col gap-6">
      {[0, 1].map((key) => (
        <Card key={key} tone="cream" className="flex flex-col gap-4">
          <div className="h-6 w-1/3 rounded-lg bg-beige" />
          <div className="h-10 w-full rounded-lg bg-beige" />
          <div className="h-10 w-full rounded-lg bg-beige" />
          <div className="h-11 w-32 rounded-xl bg-beige" />
        </Card>
      ))}
    </div>
  )
}

function ProfileForm({ profile }: { profile: Profile }) {
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)
  const setAuth = useAuthStore((state) => state.setAuth)
  const [saved, setSaved] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      storeName: profile.storeName,
      mainManager: profile.mainManager,
      responsibleManager: profile.responsibleManager,
    },
  })

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updated) => {
      if (token && user) setAuth(token, { ...user, storeName: updated.storeName })
      setSaved(true)
    },
  })

  return (
    <Card tone="cream" aria-labelledby="profile-title">
      <h2 id="profile-title" className="mb-4 flex items-center gap-2 font-display text-xl font-bold">
        <Store size={22} strokeWidth={2.5} aria-hidden="true" className="text-rose-deep" />
        Dados da confeitaria
      </h2>
      <form
        noValidate
        onSubmit={handleSubmit((values) => {
          setSaved(false)
          mutation.mutate(values)
        })}
        className="flex flex-col gap-4"
      >
        {saved && <SuccessAlert message="Dados atualizados com sucesso." />}
        {mutation.isError && (
          <ErrorAlert message={apiErrorMessage(mutation.error, 'Não foi possível salvar os dados. Tente novamente.')} />
        )}

        <Field id="email" label="E-mail de acesso">
          <input id="email" type="email" value={profile.email} disabled readOnly className={inputClass} />
        </Field>
        <Field id="storeName" label="Nome da confeitaria" error={errors.storeName?.message}>
          <input id="storeName" type="text" maxLength={150} {...register('storeName')} className={inputClass} />
        </Field>
        <Field id="mainManager" label="Gestor principal" error={errors.mainManager?.message}>
          <input id="mainManager" type="text" maxLength={120} {...register('mainManager')} className={inputClass} />
        </Field>
        <Field id="responsibleManager" label="Gestor responsável" error={errors.responsibleManager?.message}>
          <input
            id="responsibleManager"
            type="text"
            maxLength={120}
            {...register('responsibleManager')}
            className={inputClass}
          />
        </Field>

        <div className="flex justify-end">
          <button type="submit" disabled={mutation.isPending} className={primaryButtonClass}>
            {mutation.isPending ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </div>
      </form>
    </Card>
  )
}

function PasswordForm() {
  const [saved, setSaved] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })

  const mutation = useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      reset()
      setSaved(true)
    },
  })

  return (
    <Card tone="beige" aria-labelledby="password-title">
      <h2 id="password-title" className="mb-4 flex items-center gap-2 font-display text-xl font-bold">
        <KeyRound size={22} strokeWidth={2.5} aria-hidden="true" className="text-rose-deep" />
        Segurança
      </h2>
      <form
        noValidate
        onSubmit={handleSubmit(({ currentPassword, newPassword }) => {
          setSaved(false)
          mutation.mutate({ currentPassword, newPassword })
        })}
        className="flex flex-col gap-4"
      >
        {saved && <SuccessAlert message="Senha alterada com sucesso." />}
        {mutation.isError && (
          <ErrorAlert message={apiErrorMessage(mutation.error, 'Não foi possível alterar a senha. Tente novamente.')} />
        )}

        <Field id="currentPassword" label="Senha atual" error={errors.currentPassword?.message}>
          <input
            id="currentPassword"
            type="password"
            autoComplete="current-password"
            {...register('currentPassword')}
            className={inputClass}
          />
        </Field>
        <Field id="newPassword" label="Nova senha" error={errors.newPassword?.message}>
          <input
            id="newPassword"
            type="password"
            autoComplete="new-password"
            {...register('newPassword')}
            className={inputClass}
          />
        </Field>
        <Field id="confirmPassword" label="Confirmar nova senha" error={errors.confirmPassword?.message}>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            {...register('confirmPassword')}
            className={inputClass}
          />
        </Field>

        <div className="flex justify-end">
          <button type="submit" disabled={mutation.isPending} className={primaryButtonClass}>
            {mutation.isPending ? 'Alterando...' : 'Alterar senha'}
          </button>
        </div>
      </form>
    </Card>
  )
}

export function SettingsPage() {
  const { data, isPending, isError, isFetching, refetch } = useQuery({
    queryKey: ['settings-profile'],
    queryFn: getProfile,
    retry: shouldRetry,
  })

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <h1 className="font-display text-3xl font-bold">Configurações</h1>

      {isPending && <SettingsSkeleton />}

      {isError && !data && (
        <Card tone="beige" role="alert" className="flex flex-col items-start gap-3">
          <p className="flex items-center gap-2 text-lg font-semibold">
            <TriangleAlert size={22} strokeWidth={2.5} aria-hidden="true" className="text-rose-deep" />
            Não foi possível carregar as configurações.
          </p>
          <p className="text-sm text-cacao/80">Tente novamente em instantes.</p>
          <button type="button" onClick={() => void refetch()} disabled={isFetching} className={primaryButtonClass}>
            {isFetching ? 'Tentando...' : 'Tentar novamente'}
          </button>
        </Card>
      )}

      {data && (
        <>
          <ProfileForm profile={data} />
          <PasswordForm />
        </>
      )}
    </div>
  )
}
