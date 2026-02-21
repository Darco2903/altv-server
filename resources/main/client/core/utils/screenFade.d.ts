declare module "alt-client" {
    namespace Utils {
        function screenFadeIn(duration: number): Promise<void>;
        function screenFadeOut(duration: number): Promise<void>;
    }
}
