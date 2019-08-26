export class SVGUtil {

    public static createElement<T extends SVGElement>(qualifiedName: string): T {
        return document.createElementNS('http://www.w3.org/2000/svg', qualifiedName) as T;
    }
    
}