/*
 *  Contains hotkey map and their handlers.
 *  Created On 14 May 2022
 */

export const hotkeyMap = {
    SEARCH: '/',
}

export const hotkeyHandlers = {
    SEARCH: (e: any) => {
        // eslint-disable-next-line prettier/prettier
        (document.querySelector('#txtSearch') as any).focus()
        e.preventDefault()
        return false
    },
}
