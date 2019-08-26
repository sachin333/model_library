export class CommonUtil {
    public static readonly APP_IMG_PATH = 'assets/images/';

    private static uidCounter = 1;

    public static getUID = (): string => {
        return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase() + '_' + CommonUtil.uidCounter++;
    }
}