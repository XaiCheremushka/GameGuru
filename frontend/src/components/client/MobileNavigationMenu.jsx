import React, { useEffect, useState } from 'react';
import '../../styles/css/mobile-navigation-menu.css';
import {Link} from "react-router-dom";

const LINKS = [
    { href: '/categories', label: 'Категории' },
    { href: '/genres', label: 'Жанры' },
    { href: '/developers', label: 'Разработчики' },
    { href: '/games', label: 'Игры' },
];

export default function MobileNavigationMenu() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const btn = document.querySelector('.burger-mobile-nav-menu');
        if (!btn) return;
        const toggle = () => setOpen(prev => !prev);
        btn.addEventListener('click', toggle);
        return () => btn.removeEventListener('click', toggle);
    }, []);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') setOpen(false);
        };
        if (open) document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open]);

    const close = () => setOpen(false);

    const overlayClass = `mobile-nav-overlay${open ? ' open' : ''}`;
    const panelClass = `mobile-nav-panel${open ? ' open' : ''}`;

    return (
        <>
            <div
                aria-hidden={!open}
                onClick={close}
                className={overlayClass}
            />
            <nav
                role="dialog"
                aria-modal="true"
                className={panelClass}
            >
                <ul className="mobile-nav-list">
                    {LINKS.map((item) => (
                        <li key={item.href} className="mobile-nav-item">
                            <Link
                                to={item.href}
                                className="mobile-nav-link"
                                onClick={close}>{item.label}</Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </>
    );
}
