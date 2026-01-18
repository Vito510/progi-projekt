import type Track from "../../interfaces/Track";

export interface ChartDataPoint {
    x: number; //udaljenost od prethodne točke
    y: number; //visina u toj točki
}

export interface TrackStatistics {
    numPoints: number;
    horizontalDistance: string;
    slopeDistance: string;
    minHeight: string;
    maxHeight: string;
    heightDifference: string;
}

// vraća niz točaka (delta_x, visina) koji služe za sljedeće funkcije (i za graf u ButtonStatistika)
// razlog je što mora skalirati udaljenosti x i y da budu u metrima, a ne 0 do 1
export function generateChartData(track: Track): ChartDataPoint[] {
    // računa okomitu (sjever-jug) i horizontalnu (istog-zapad) razliku u metrima karte
    const avgLat = (track.min_lat + track.max_lat) / 2; //treba za korekciju longitude
    const latLen = (track.max_lat - track.min_lat) * Math.PI * 6371 * 1000 / 180
    const longLen = (track.max_lon - track.min_lon) * Math.PI * 6371 * 1000 * Math.cos(avgLat * Math.PI / 180) / 180

    let cumulativeDistance = 0;
    
    return track.points.map((point, index) => {
        if (index === 0) {
            return { x: 0, y: point.z };
        }
        
        const prev = track.points[index - 1];
        //skaliramo x i y na širinu i dužinu karte
        const distance = Math.sqrt(
            Math.pow((point.x - prev.x) * longLen, 2) + 
            Math.pow((point.y - prev.y) * latLen, 2)
        );
        
        cumulativeDistance += distance;
        
        return { x: cumulativeDistance, y: point.z };
    });
}

// wrapper za sve funkcije statistike ispod (da ne moram pozivati svaku pojedinačno u ButtonStatistisc)
export function calculateTrackStatistics(chartData: ChartDataPoint[]): TrackStatistics | null {
    if (chartData.length === 0) return null;

    const horizontalDistance = calculateHorizontalDistance(chartData);
    const slopeDistance = calculateSlopeDistance(chartData);
    const minHeight = calculateMinHeight(chartData);
    const maxHeight = calculateMaxHeight(chartData);
    const heightDifference = maxHeight - minHeight;

    return {
        numPoints: chartData.length,
        horizontalDistance: horizontalDistance.toFixed(2),
        slopeDistance: slopeDistance.toFixed(2),
        minHeight: minHeight.toFixed(2),
        maxHeight: maxHeight.toFixed(2),
        heightDifference: heightDifference.toFixed(2)
    };
}

// vraća zračnu udaljenost staze (kao gledano odozgora)
export function calculateHorizontalDistance(chartData: ChartDataPoint[]): number {
    if (chartData.length === 0) return 0;
    return chartData[chartData.length - 1].x;
}

// ukupna udaljenost po terenu (uzimajući u obzir nagibe)
export function calculateSlopeDistance(chartData: ChartDataPoint[]): number {
    let slopeDistance = 0;
    
    for (let i = 1; i < chartData.length; i++) {
        const horizontalSegment = chartData[i].x - chartData[i - 1].x;
        const verticalSegment = chartData[i].y - chartData[i - 1].y;
        
        const segmentDistance = Math.sqrt(
            Math.pow(horizontalSegment, 2) + 
            Math.pow(verticalSegment, 2)
        );
        slopeDistance += segmentDistance;
    }
    
    return slopeDistance;
}


export function calculateMinHeight(chartData: ChartDataPoint[]): number {
    if (chartData.length === 0) return 0;
    const heights = chartData.map(p => p.y);
    return Math.min(...heights);
}

export function calculateMaxHeight(chartData: ChartDataPoint[]): number {
    if (chartData.length === 0) return 0;
    const heights = chartData.map(p => p.y);
    return Math.max(...heights);
}


