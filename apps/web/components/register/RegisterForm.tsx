'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Car,
  Check,
  Phone,
  Shield,
  ShieldCheck,
  User,
  X,
} from 'lucide-react'
import {
  RegisterVehicleFormSchema,
  type RegisterVehicleFormInput,
  type VehicleType,
} from '@parksafe/types'
import { useTranslations } from 'next-intl'
import { requestOtp } from '@/lib/api/auth'
import { ApiError } from '@/lib/api/client'
import { loadRegisterDraft, saveRegisterDraft } from '@/lib/flow-storage'
import { routes } from '@/lib/routes'
import { ParkSafeBrandLogo } from '@/components/shared/ParkSafeBrandLogo'
import { formatPlateDisplay, sanitizePlateInput } from '@/lib/utils/plateFormat'
import { toE164Indian } from '@/lib/utils/phoneUtils'
import {
  CheckboxField,
  PhoneField,
  PillButton,
  SectionCard,
  SelectField,
  TextField,
} from './register-ui'
const defaultValues: RegisterVehicleFormInput = {
  plate: '',
  make: '',
  model: '',
  colour: '',
  vehicleType: 'CAR',
  ownerName: '',
  ownerPhone: '',
  emergencyName: '',
  emergencyPhone: '',
  whatsappEnabled: true,
  consent: false,
}

/**
 * Full registration form — Figma layout with OTP verification and API submission.
 */
export function RegisterForm() {
  const t = useTranslations()
  const router = useRouter()
  const vehicleTypeOptions = useMemo(
    (): Array<{ value: VehicleType; label: string }> => [
      { value: 'CAR', label: t('REGISTER_VEHICLE_TYPE_CAR') },
      { value: 'BIKE', label: t('REGISTER_VEHICLE_TYPE_BIKE') },
      { value: 'SCOOTER', label: t('REGISTER_VEHICLE_TYPE_SCOOTER') },
      { value: 'TRUCK', label: t('REGISTER_VEHICLE_TYPE_TRUCK') },
      { value: 'OTHER', label: t('REGISTER_VEHICLE_TYPE_OTHER') },
    ],
    [t]
  )

  const searchParams = useSearchParams()
  const tagCode = searchParams.get('tag') ?? undefined

  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const submitErrorRef = useRef<HTMLDivElement>(null)

  const {
    register,
    control,
    handleSubmit,
    reset,
    clearErrors,
    watch,
    formState: { errors, isSubmitting: isFormSubmitting },
  } = useForm<RegisterVehicleFormInput>({
    resolver: zodResolver(RegisterVehicleFormSchema),
    defaultValues,
    mode: 'onBlur',
  })

  useEffect(() => {
    const draft = loadRegisterDraft()
    if (draft) {
      reset(draft.form)
    }
  }, [reset])

  useEffect(() => {
    if (submitError) {
      submitErrorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [submitError])

  const formValues = watch()
  const isFormReady = useMemo(
    () =>
      formValues.consent &&
      formValues.whatsappEnabled &&
      RegisterVehicleFormSchema.safeParse(formValues).success,
    [formValues]
  )

  const onFormSubmit = handleSubmit(async data => {
    setSubmitError(null)
    setIsSendingOtp(true)

    try {
      await requestOtp({ phone: toE164Indian(data.ownerPhone) })
      saveRegisterDraft(data, tagCode)
      router.push(routes.registerOtp(tagCode ? { tag: tagCode } : undefined))
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof TypeError
            ? t('GLOBAL_ERROR_NETWORK')
            : t('GLOBAL_ERROR_GENERIC')
      setSubmitError(message)
    } finally {
      setIsSendingOtp(false)
    }
  })

  const handleReset = () => {
    reset(defaultValues)
    setSubmitError(null)
  }

  return (
    <>
      <div className="relative min-h-screen bg-gradient-to-b from-white via-white to-register-tint">
        <div className="absolute right-0 top-0 flex justify-end p-6">
          <Link
            href={routes.home}
            className="flex size-11 items-center justify-center rounded-full border border-neutral-200 bg-white/80 backdrop-blur-sm"
            aria-label={t('REGISTER_CLOSE_ARIA')}
          >
            <X className="size-5 text-neutral-600" aria-hidden />
          </Link>
        </div>

        <form
          onSubmit={onFormSubmit}
          noValidate
          className="mx-auto flex w-full max-w-[440px] flex-col gap-8 px-6 pb-32 pt-[99px]"
        >
          {/* Header */}
          <header className="flex flex-col gap-6">
            <ParkSafeBrandLogo />
            <div className="flex flex-col gap-3">
              <h1 className="text-[28px] font-bold leading-[36.4px] tracking-[-0.56px] text-black">
                {t('REGISTER_PAGE_TITLE')}
              </h1>
              <p className="text-base leading-[25.6px] tracking-[-0.32px] text-slate-500">
                {t('REGISTER_PAGE_SUBTITLE')}
              </p>
            </div>
          </header>

          {/* Vehicle Details */}
          <SectionCard title={t('REGISTER_SECTION_VEHICLE')} icon={<Car className="size-5" strokeWidth={2} />}>
            <div className="flex flex-col gap-4">
              <Controller
                name="plate"
                control={control}
                render={({ field }) => (
                  <TextField
                    label={t('REGISTER_VEHICLE_NUMBER_LABEL')}
                    required
                    name="plate"
                    placeholder={t('REGISTER_VEHICLE_NUMBER_PLACEHOLDER')}
                    autoComplete="off"
                    autoCapitalize="characters"
                    value={formatPlateDisplay(field.value)}
                    maxLength={17}
                    onChange={e => {
                      field.onChange(sanitizePlateInput(e.target.value))
                      if (errors.plate) clearErrors('plate')
                    }}
                    onBlur={field.onBlur}
                    error={errors.plate?.message}
                    className="uppercase"
                  />
                )}
              />
              <TextField
                label={t('REGISTER_VEHICLE_BRAND_LABEL')}
                required
                placeholder={t('REGISTER_VEHICLE_BRAND_PLACEHOLDER')}
                {...register('make')}
                error={errors.make?.message}
              />
              <TextField
                label={t('REGISTER_VEHICLE_MODEL_LABEL')}
                required
                placeholder={t('REGISTER_VEHICLE_MODEL_PLACEHOLDER')}
                {...register('model')}
                error={errors.model?.message}
              />
              <TextField
                label={t('REGISTER_VEHICLE_COLOR_LABEL')}
                required
                placeholder={t('REGISTER_VEHICLE_COLOR_PLACEHOLDER')}
                {...register('colour')}
                error={errors.colour?.message}
              />
              <Controller
                name="vehicleType"
                control={control}
                render={({ field }) => (
                  <SelectField
                    label={t('REGISTER_VEHICLE_TYPE_LABEL')}
                    name="vehicleType"
                    required
                    value={field.value}
                    onChange={field.onChange}
                    options={vehicleTypeOptions}
                    placeholder={t('REGISTER_VEHICLE_TYPE_PLACEHOLDER')}
                    error={errors.vehicleType?.message}
                  />
                )}
              />
            </div>
          </SectionCard>

          {/* Owner Details */}
          <SectionCard title={t('REGISTER_SECTION_OWNER')} icon={<User className="size-5" strokeWidth={2} />}>
            <div className="flex flex-col gap-4">
              <TextField
                label={t('REGISTER_OWNER_NAME_LABEL')}
                required
                placeholder={t('REGISTER_OWNER_NAME_PLACEHOLDER')}
                autoComplete="name"
                {...register('ownerName')}
                error={errors.ownerName?.message}
              />
              <Controller
                name="ownerPhone"
                control={control}
                render={({ field }) => (
                  <PhoneField
                    label={t('REGISTER_OWNER_PHONE_LABEL')}
                    name="ownerPhone"
                    required
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t('REGISTER_OWNER_PHONE_PLACEHOLDER')}
                    error={errors.ownerPhone?.message}
                  />
                )}
              />
            </div>
          </SectionCard>

          {/* Emergency Contact */}
          <SectionCard
            title={t('REGISTER_SECTION_EMERGENCY')}
            icon={<Phone className="size-5" strokeWidth={2} />}
          >
            <div className="flex flex-col gap-4">
              <TextField
                label={t('REGISTER_EMERGENCY_NAME_LABEL')}
                required
                placeholder={t('REGISTER_EMERGENCY_NAME_PLACEHOLDER')}
                autoComplete="name"
                {...register('emergencyName')}
                error={errors.emergencyName?.message}
              />
              <Controller
                name="emergencyPhone"
                control={control}
                render={({ field }) => (
                  <PhoneField
                    label={t('REGISTER_EMERGENCY_PHONE_LABEL')}
                    name="emergencyPhone"
                    required
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t('REGISTER_EMERGENCY_PHONE_PLACEHOLDER')}
                    error={errors.emergencyPhone?.message}
                  />
                )}
              />
            </div>
          </SectionCard>

          {/* Consent */}
          <SectionCard
            title={t('REGISTER_SECTION_CONSENT')}
            icon={<Shield className="size-5" strokeWidth={2} />}
            variant="consent"
          >
            <div className="flex flex-col gap-4">
              <Controller
                name="whatsappEnabled"
                control={control}
                render={({ field }) => (
                  <CheckboxField
                    label={t('REGISTER_WHATSAPP_LABEL')}
                    name="whatsappEnabled"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <Controller
                name="consent"
                control={control}
                render={({ field }) => (
                  <CheckboxField
                    label={t('REGISTER_CONSENT_LABEL')}
                    name="consent"
                    checked={field.value}
                    onChange={field.onChange}
                    error={errors.consent?.message}
                  />
                )}
              />
            </div>
          </SectionCard>

          {/* Actions */}
          <div className="flex gap-4">
            <PillButton type="button" variant="secondary" onClick={handleReset}>
              {t('REGISTER_RESET_CTA')}
            </PillButton>
            <PillButton
              type="submit"
              variant="primary"
              disabled={!isFormReady || isSendingOtp || isFormSubmitting}
            >
              {isSendingOtp ? t('OTP_SENDING') : t('REGISTER_SUBMIT_CTA')}
            </PillButton>
          </div>

          {submitError && (
            <div
              ref={submitErrorRef}
              className="rounded-lg bg-error-50 px-4 py-3 text-sm text-error-500"
              role="alert"
              aria-live="polite"
            >
              {submitError}
            </div>
          )}

          {/* Privacy footer */}
          <footer className="border-t border-neutral-200 pt-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <ShieldCheck className="size-5 text-primary-500" aria-hidden />
              <div className="flex flex-col gap-2">
                <p className="text-[15px] font-semibold leading-[22.5px] tracking-[-0.3px] text-neutral-900">
                  {t('REGISTER_PRIVACY_TITLE')}
                </p>
                <p className="max-w-xs text-[13px] leading-[20.8px] text-gray-500">
                  {t('REGISTER_PRIVACY_BODY')}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                {[
                  t('REGISTER_PRIVACY_BADGE_ANONYMOUS'),
                  t('REGISTER_PRIVACY_BADGE_SECURE'),
                  t('REGISTER_PRIVACY_BADGE_NO_SPAM'),
                ].map(badge => (
                  <span
                    key={badge}
                    className="flex items-center gap-1.5 text-xs leading-[18px] text-gray-500"
                  >
                    <Check className="size-4 text-primary-500" aria-hidden />
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </footer>
        </form>
      </div>
    </>
  )
}
