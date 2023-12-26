import dynamic from 'next/dynamic'

const MapComp = dynamic(() => import('@/components/Map/MapComponent'), { ssr: true });

async function Map() {
    return (
        <div className='w-full'>
            <MapComp />
        </div>
    );
}

export default Map;
