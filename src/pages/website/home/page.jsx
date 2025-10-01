import Ads from "./sections/ads"
import Arc from "./sections/arc"
import Hero from "./sections/hero"
import PlatformsSection from "./sections/paltforms"
const Home = ()=>{
    return(<div >
        <Hero/>
        <div className="flex flex-col gap-10 md:gap-20">
            <Arc/>
            <Ads isHome={true}/>
            <PlatformsSection/>
        </div>
    </div>)
}
export default Home