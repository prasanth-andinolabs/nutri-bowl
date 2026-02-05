type AuthModalProps = {
  isOpen: boolean;
  mode: 'signin' | 'signup';
  authName: string;
  authPhone: string;
  authPassword: string;
  authError: string;
  authLoading: boolean;
  showPassword: boolean;
  onModeChange: (mode: 'signin' | 'signup') => void;
  onNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onTogglePassword: () => void;
  onSubmit: () => void;
  onClose: () => void;
  onGuest: () => void;
};

export function AuthModal({
  isOpen,
  mode,
  authName,
  authPhone,
  authPassword,
  authError,
  authLoading,
  showPassword,
  onModeChange,
  onNameChange,
  onPhoneChange,
  onPasswordChange,
  onTogglePassword,
  onSubmit,
  onClose,
  onGuest,
}: AuthModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl p-6 shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">{mode === 'signup' ? 'Create account' : 'Sign in'}</h3>
          <button
            className="text-sm text-green-700 border border-green-200 px-3 py-1 rounded-full hover:bg-green-50"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={`text-xs px-3 py-1 rounded-full border ${
                mode === 'signin'
                  ? 'bg-green-600 text-white border-green-600'
                  : 'text-green-700 border-green-200 hover:bg-green-50'
              }`}
              onClick={() => onModeChange('signin')}
            >
              Login
            </button>
            <button
              type="button"
              className={`text-xs px-3 py-1 rounded-full border ${
                mode === 'signup'
                  ? 'bg-green-600 text-white border-green-600'
                  : 'text-green-700 border-green-200 hover:bg-green-50'
              }`}
              onClick={() => onModeChange('signup')}
            >
              Sign up
            </button>
          </div>
          {mode === 'signup' && (
            <div>
              <label className="text-xs font-semibold text-gray-700">Name</label>
              <input
                className="mt-2 w-full rounded-xl border border-green-100 px-3 py-2 text-sm"
                placeholder="Enter your name"
                value={authName}
                onChange={(event) => onNameChange(event.target.value)}
              />
            </div>
          )}
          <div>
            <label className="text-xs font-semibold text-gray-700">Phone</label>
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-green-100 px-3 py-2 focus-within:ring-2 focus-within:ring-green-200">
              <span className="text-lg" aria-hidden="true">
                🇮🇳
              </span>
              <span className="text-sm text-gray-500">+91</span>
              <input
                type="tel"
                inputMode="numeric"
                className="w-full border-0 bg-transparent p-0 text-sm focus:outline-none"
                placeholder="10-digit mobile number"
                maxLength={10}
                value={authPhone}
                onChange={(event) =>
                  onPhoneChange(event.target.value.replace(/\D/g, '').slice(0, 10))
                }
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700">Password</label>
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-green-100 px-3 py-2">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full border-0 bg-transparent p-0 text-sm focus:outline-none"
                placeholder="Enter your password"
                value={authPassword}
                onChange={(event) => onPasswordChange(event.target.value)}
              />
              <button
                type="button"
                className="text-xs text-green-700"
                onClick={onTogglePassword}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          {authError && <div className="text-xs text-red-600">{authError}</div>}
          <button
            type="button"
            className="w-full bg-green-600 text-white py-3 rounded-full font-semibold hover:bg-green-700 transition disabled:opacity-70"
            onClick={onSubmit}
            disabled={authLoading}
          >
            {authLoading ? 'Please wait...' : mode === 'signup' ? 'Create account' : 'Sign in'}
          </button>
          <button
            type="button"
            className="w-full text-sm text-gray-600"
            onClick={onGuest}
          >
            Continue as guest
          </button>
        </div>
      </div>
    </div>
  );
}
