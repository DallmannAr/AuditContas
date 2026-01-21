import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeChanger() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="
        fixed bottom-6 right-6 z-50
        h-12 w-12 rounded-full
        flex items-center justify-center
        bg-primary text-primary-foreground
        shadow-lg
        transition-all
        hover:bg-primary/90
        active:scale-95
      "
    >
      {theme === "dark" ? (
        <Sun className="size-5" />
      ) : (
        <Moon className="size-5" />
      )}
    </button>
  );
}