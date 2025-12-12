const BASE_COLORS = [
  { bgColor: 'bg-red-100', textColor: 'text-red-600' },
  { bgColor: 'bg-orange-100', textColor: 'text-orange-600' },
  { bgColor: 'bg-amber-100', textColor: 'text-amber-600' },
  { bgColor: 'bg-yellow-100', textColor: 'text-yellow-600' },
  { bgColor: 'bg-lime-100', textColor: 'text-lime-600' },
  { bgColor: 'bg-green-100', textColor: 'text-green-600' },
  { bgColor: 'bg-emerald-100', textColor: 'text-emerald-600' },
  { bgColor: 'bg-teal-100', textColor: 'text-teal-600' },
  { bgColor: 'bg-cyan-100', textColor: 'text-cyan-600' },
  { bgColor: 'bg-sky-100', textColor: 'text-sky-600' },
  { bgColor: 'bg-blue-100', textColor: 'text-blue-600' },
  { bgColor: 'bg-indigo-100', textColor: 'text-indigo-600' },
  { bgColor: 'bg-violet-100', textColor: 'text-violet-600' },
  { bgColor: 'bg-purple-100', textColor: 'text-purple-600' },
  { bgColor: 'bg-fuchsia-100', textColor: 'text-fuchsia-600' },
  { bgColor: 'bg-pink-100', textColor: 'text-pink-600' },
  { bgColor: 'bg-rose-100', textColor: 'text-rose-600' },
] as const;

export const getColors = (key: string | null | undefined) => {
  if (!key) return { bgColor: 'bg-neutral-100', textColor: 'text-neutral-600' };

  let hash = 0;
  const str = key.toString();
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash + str.charCodeAt(i) * 31) | 0;
  }
  const index = Math.abs(hash) % BASE_COLORS.length;
  return BASE_COLORS[index];
};
