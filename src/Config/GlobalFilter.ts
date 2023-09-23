import * as RegExpTools from '../lib/RegExpTools';
import { getSettings, updateSettings } from './Settings';

/**
 * GlobalFilter is a wrapper around the {@link Settings.globalFilter} value in {@link Settings}.
 *
 * Limitations:
 * - All methods are static, so it is a collection of multiple static things
 *     - This is in contrast to {@link GlobalQuery} what has just the one static method, {@link GlobalQuery.getInstance}.
 * - It does not currently have any data of its own. All data is stored directly in the global {@link Settings}.
 * - It does not yet provide any interface to control {@link Settings.removeGlobalFilter}
 */
export class GlobalFilter {
    static empty = '';

    static get(): string {
        const { globalFilter } = getSettings();
        return globalFilter;
    }

    static set(value: string) {
        updateSettings({ globalFilter: value });
    }

    static reset() {
        updateSettings({ globalFilter: GlobalFilter.empty });
    }

    static isEmpty(): boolean {
        return GlobalFilter.get() === GlobalFilter.empty;
    }

    static equals(tag: string): boolean {
        return GlobalFilter.get() === tag;
    }

    static includedIn(description: string): boolean {
        const globalFilter = GlobalFilter.get();
        return description.includes(globalFilter);
    }

    static prependTo(description: string): string {
        return GlobalFilter.get() + ' ' + description;
    }

    static removeAsWordFromDependingOnSettings(description: string): string {
        const removeGlobalFilter = GlobalFilter.getRemoveGlobalFilter();
        if (removeGlobalFilter) {
            return GlobalFilter.removeAsWordFrom(description);
        }

        return description;
    }

    static getRemoveGlobalFilter() {
        const { removeGlobalFilter } = getSettings();
        return removeGlobalFilter;
    }

    /**
     * Search for the global filter for the purpose of removing it from the description, but do so only
     * if it is a separate word (preceding the beginning of line or a space and followed by the end of line
     * or a space), because we don't want to cut-off nested tags like #task/subtag.
     * If the global filter exists as part of a nested tag, we keep it untouched.
     */
    static removeAsWordFrom(description: string): string {
        if (GlobalFilter.isEmpty()) {
            return description;
        }

        // This matches the global filter (after escaping it) only when it's a complete word
        const theRegExp = RegExp('(^|\\s)' + RegExpTools.escapeRegExp(GlobalFilter.get()) + '($|\\s)', 'ug');

        if (description.search(theRegExp) > -1) {
            description = description.replace(theRegExp, '$1$2').replace('  ', ' ').trim();
        }

        return description;
    }

    static removeAsSubstringFrom(description: string): string {
        const globalFilter = GlobalFilter.get();
        return description.replace(globalFilter, '').trim();
    }
}
