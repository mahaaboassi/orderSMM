import Ads from "./sections/ads"
import Arc from "./sections/arc"
import Hero from "./sections/hero"
const Home = ()=>{
    return(<div>
        <Hero/>
        <Arc/>
        <Ads isHome={true}/>
    </div>)
}
export default Home