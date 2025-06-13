type Variant = "primary" | "secondary" | "danger" | "ghost";

export const buttonVariants: Record<Variant, string> = {
  primary: "bg-green hover:bg-green/80 text-bg",
  secondary: "bg-violet hover:bg-violet/80 text-white",
  danger: "bg-red hover:bg-red/80 text-white",
  ghost: "bg-transparent hover:bg-bg/40 text-white",
};

export function Button({
  children,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-md font-semibold transition ${
        buttonVariants[variant]
      } ${props.className ?? ""}`}
    >
      {children}
    </button>
  );
}
