import Ads from "./sections/ads"
import Arc from "./sections/arc"
import Hero from "./sections/hero"
const Home = ()=>{
    return(<div >
        <Hero/>
        <div className="flex flex-col gap-10 md:gap-20">
            <Arc/>
            <Ads isHome={true}/>
        </div>
    </div>)
}
export default Home