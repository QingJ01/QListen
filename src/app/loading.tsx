import { Loader2 } from 'lucide-react';

export default function Loading() {
    return (
        <div
            style={{
                display: 'flex',
                height: '100%',
                minHeight: '400px',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-tertiary)'
            }}
        >
            <Loader2 size={40} className="animate-spin" />
        </div>
    );
}
