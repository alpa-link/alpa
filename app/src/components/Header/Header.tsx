/*
 *  Site-wide header component contains mainly the
 *  logo & user profile menu.
 *  Created On 08 February 2022
 */

import { ReactElement } from 'react';

export const Header = (): ReactElement => <header className="bg-slate-200 py-6">
    <div className="container mx-auto flex justify-between items-center px-8">
        {/* brand */}
        <a href="/">alpa</a>
    </div>
</header>
