export const getBgColor = (username: string): string => {
    if (!username) return 'bg-gray-500';

    const hash = username.split('').reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    const colors = [
        'bg-red-500',
        'bg-orange-500',
        'bg-amber-500',
        'bg-yellow-500',
        'bg-lime-500',
        'bg-green-500',
        'bg-emerald-500',
        'bg-teal-500',
        'bg-cyan-500',
        'bg-sky-500',
        'bg-blue-500',
        'bg-indigo-500',
        'bg-violet-500',
        'bg-purple-500',
        'bg-fuchsia-500',
        'bg-pink-500',
        'bg-rose-500',
        'bg-slate-500',
    ];

    const index = Math.abs(hash) % colors.length;
    return colors[index];
};
