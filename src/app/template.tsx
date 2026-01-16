'use client';

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ animation: 'fade-in 0.4s ease-out' }}>
            {children}
        </div>
    );
}
