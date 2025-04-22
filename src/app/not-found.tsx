'use client';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="text-center p-6">
                <h1 className="text-6xl font-bold text-white mb-4">404</h1>
                <p className="text-xl text-white mb-8">
                    Друг, видимо ты зашел не по той ссылке или у нас что-то сломалось. Не бойся, и жми на кнопочку ниже, она вернет тебя
                    домой.
                </p>
                <Link href="/">
                    <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
                        Вернуться домой
                    </button>
                </Link>
            </div>
        </div>
    );
}
