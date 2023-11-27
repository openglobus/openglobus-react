# React port for OpenGlobus
Openglobus React Components

Install:
```bash
npm i @openglobus/react
```

Example of usage: 

`App.tsx`
```tsx
import '@openglobus/react/dist/style.css'
import Globus, {GlobeContextProvider} from '@openglobus/react'


function App() {
    return <GlobeContextProvider>
        <Globus/>
    </GlobeContextProvider>
}

export default App


```
`Button.tsx`
```tsx
import {useGlobeContext} from '@openglobus/react'
// import './buttons.css'
import {LonLat} from "@openglobus/og";


export default function ButtonContainer() {
    const {globe} = useGlobeContext()
    const clickFlyTo = () => {
        let ell = globe?.planet.ellipsoid;

        let destPos = new LonLat(10.13176, 46.18868, 10779);
        let viewPoi = new LonLat(9.98464, 46.06157, 3039);
        if (ell) {
            let lookCart = ell.lonLatToCartesian(viewPoi);
            let upVec = ell.lonLatToCartesian(destPos).normalize();
            globe?.planet.camera.flyLonLat(destPos, lookCart, upVec, 0);
        }
    }

    return <div className={'button-container'}>
        <button onClick={clickFlyTo}>Fly to</button>
    </div>
}
```