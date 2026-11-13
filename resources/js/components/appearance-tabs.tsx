
import { Appearance, useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import { LucideIcon, Monitor, Moon, Sun, Check } from 'lucide-react';
import { HTMLAttributes } from 'react';

const tabs: {
    value: Appearance;
    icon: LucideIcon;
    label: string;
    description: string;
}[] = [
        {
            value: 'light',
            icon: Sun,
            label: 'Light',
            description: 'A bright and clean appearance.',
        },
        {
            value: 'dark',
            icon: Moon,
            label: 'Dark',
            description: 'A darker look for low-light environments.',
        },
        {
            value: 'system',
            icon: Monitor,
            label: 'System',
            description: 'Automatically follow your device settings.',
        },
    ];

export default function AppearanceToggleTab({
    className = '',
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();

    return (
        <div
            className={cn(
                'grid grid-cols-1 gap-4 sm:grid-cols-3',
                className,
            )}
            {...props}
        >
            {tabs.map(({ value, icon: Icon, label, description }) => {
                const isActive = appearance === value;

                return (
                    <button
                        key={value}
                        type="button"
                        onClick={() => updateAppearance(value)}
                        aria-pressed={isActive}
                        className={cn(
                            'group relative flex min-h-40 flex-col items-start rounded-2xl border p-5 text-left transition-all duration-200',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#762f43] focus-visible:ring-offset-2',
                            isActive
                                ? 'border-[#762f43] bg-[#fdf5f5] shadow-sm ring-1 ring-[#762f43]/10'
                                : 'border-[#eadfda] bg-white hover:border-[#c99ba5] hover:bg-[#fcf8f5]',
                        )}
                    >
                        {/* Selected Indicator */}
                        <div
                            className={cn(
                                'absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full border transition-colors',
                                isActive
                                    ? 'border-[#762f43] bg-[#762f43] text-white'
                                    : 'border-[#ddcfca] bg-white text-transparent',
                            )}
                        >
                            <Check className="h-3 w-3" />
                        </div>

                        {/* Theme Icon */}
                        <div
                            className={cn(
                                'flex h-11 w-11 items-center justify-center rounded-xl transition-colors',
                                isActive
                                    ? 'bg-[#762f43] text-white'
                                    : 'bg-[#f7e9e9] text-[#762f43] group-hover:bg-[#f1dede]',
                            )}
                        >
                            <Icon className="h-5 w-5" />
                        </div>

                        {/* Theme Details */}
                        <div className="mt-5">
                            <span
                                className={cn(
                                    'text-sm font-semibold',
                                    isActive
                                        ? 'text-[#762f43]'
                                        : 'text-[#492b32]',
                                )}
                            >
                                {label}
                            </span>

                            <p className="mt-1 text-xs leading-relaxed text-[#927b7d]">
                                {description}
                            </p>
                        </div>

                        {isActive && (
                            <span className="mt-3 text-[10px] font-bold uppercase tracking-wider text-[#762f43]">
                                Currently selected
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
