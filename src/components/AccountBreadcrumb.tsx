export default function AccountBreadcrumb({ page }: { page: string }) {
    return (
        <nav className="flex text-[10px] font-bold uppercase tracking-widest text-gray-400 items-center gap-2">
            <span>User</span>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
            >
                <path d="m9 18 6-6-6-6" />
            </svg>
            <span className="text-black font-extrabold tracking-[0.1em]">
                {page}
            </span>
        </nav>
    );
}
