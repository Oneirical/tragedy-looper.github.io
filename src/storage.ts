import { browser } from "$app/environment";
import { scripts, type Script, type ScriptName, isScript } from "./model/script";



export function saveScript(script: Script) {
    if (!browser) {
        throw new Error('We need to run in Browser');
    }

    localStorage.setItem(`scripts:${script.creator}:${script.title}`, JSON.stringify(script));
}

function fromJson(str: string | undefined | null): Script | null {
    if (!str || str.length == 0) {
        return null;
    }
    try {
        const parsed = JSON.parse(str);
        if (!isScript(parsed)) {
            return null;
        }
        return parsed;
    } catch (error) {
        return null;
    }
}

export function loadAllScripts(): (Script & { local: true | undefined })[] {
    return [...loadAllLocalScripts(), ...Object.values(scripts).map(x => ({ ...x, local: undefined }))];
}
export function loadAllLocalScripts() {
    if (!browser) {
        throw new Error('We need to run in Browser');
    }
    if (!window.localStorage) {
        return [];
    }
    const result: (Script & { local: true | undefined })[] = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
            const element = localStorage.getItem(key);
            if (element) {
                const script = fromJson(element);
                if (script) {
                    result.push({ ...script, local: true });
                }
            }
        }
    }
    return result;
}
export function loadScript({ title, author, set }: { title?: string | null; author?: string | null; set?: { name: string; number: number; } | null; } = {}) {
    if (!browser) {
        throw new Error('We need to run in Browser');
    }

    if (!title && !author && !set) {
        return null;
    }

    const filter: ((x: Script | null) => x is Script) = (x): x is Script => x !== null
        && (!title || x.title == title)
        && (!author || x.creator == author)
        && (!set || (set.name == x?.set.name && set.number == x?.set.number));

    // if (title && author) {
    //     const founds = [...[fromJson(window.localStorage?.getItem(`scripts:${author}:${title}`))].ma,
    //     scripts[title as ScriptName]];
    //     ;
    //     const filtered = founds.filter(filter);
    //     return filtered;
    // } else {
    const found = loadAllScripts().filter(filter);
    return found;
    // }

}