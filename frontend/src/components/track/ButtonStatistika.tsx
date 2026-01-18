import Button from "../general/Button";
import List from '../general/List.js';
import Card from '../general/Card.js';
import Popup from '../general/Popup.js';
import Placeholder from "../general/Placeholder.js";
import { useState, useEffect, useRef } from "react";
import type Track from "../../interfaces/Track";
import { Chart } from 'chart.js/auto';

interface Props {
    track: Track;
}

export default function ButtonLikeTrack({ track }: Props) {
    const [stats, setStats] = useState<boolean>(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<Chart | null>(null);
    const [chartData, setChartData] = useState<{ x: number, y: number }[]>([]);

    useEffect(() => {
        if (!stats || !canvasRef.current) return;

        // Destroy previous chart if it exists
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        // računa okomitu (sjever-jug) i horizontalnu (istog-zapad) razliku u metrima karte
        const avgLat = (track.min_lat + track.max_lat) / 2; //treba za korekciju longitude
        const latLen = (track.max_lat - track.min_lat) * Math.PI * 6371 * 1000 / 180
        const longLen = (track.max_lon - track.min_lon) * Math.PI * 6371 * 1000 * Math.cos(avgLat * Math.PI / 180) / 180

        let cumulativeDistance = 0;
        const chartData = track.points.map((point, index) => {
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

        setChartData(chartData);

        chartRef.current = new Chart(canvasRef.current, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Visina',
                    data: chartData,
                    borderColor: 'rgb(75, 192, 173)',
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    x: { type: 'linear' },
                    y: { type: 'linear' }
                }
            }
        });

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [stats, track.points]);


    // Calculate statistics
    const calculateStats = (data: { x: number, y: number }[]) => {
        if (data.length === 0) return null;

        // kao zračna udaljenost, kad se gleda odozgora
        const horizontalDistance = data[data.length - 1].x;

        // ukupna udaljenost, po terenu
        let slopeDistance = 0;
        for (let i = 1; i < data.length; i++) {
            const horizontalSegment = data[i].x - data[i - 1].x;
            const verticalSegment = data[i].y - data[i - 1].y;
            
            const segmentDistance = Math.sqrt(
                Math.pow(horizontalSegment, 2) + 
                Math.pow(verticalSegment, 2)
            );
            slopeDistance += segmentDistance;
        }

        // Height statistics
        const heights = data.map(p => p.y);
        const minHeight = Math.min(...heights);
        const maxHeight = Math.max(...heights);

        return {
            numPoints: data.length,
            horizontalDistance: horizontalDistance.toFixed(2),
            slopeDistance: slopeDistance.toFixed(2),
            minHeight: minHeight.toFixed(2),
            maxHeight: maxHeight.toFixed(2),
            heightDifference: (maxHeight - minHeight).toFixed(2)
        };
    };

    const statistics = stats ? calculateStats(chartData) : null;




    return (
        <>
            <Button type='secondary' onClick={() => {setStats(true)}}>
                <i className='fa fa-area-chart'></i>
                <p>Statistika</p>
            </Button>
            {stats && 
                <Popup>
                    <Card>
                        <header>
                            <List type='row' gap='medium' align='center'>
                                <h2>Statistike staze</h2>
                                <Button type='tertiary' onClick={() => {setStats(false)}}>
                                    <i className='fa fa-times'></i>
                                    <p>Zatvori</p>
                                </Button>
                            </List>
                        </header>
                        <section style={{ width: '80vw', maxWidth: '1000px', minWidth: '300px' }}>
                            <canvas ref={canvasRef}></canvas>
                            {statistics && (
                            <div>
                                <p><strong>Broj točaka:</strong> {statistics.numPoints}</p>
                                <p><strong>Horizontalna udaljenost:</strong> {statistics.horizontalDistance}m</p>
                                <p><strong>Udaljenost s nagibom:</strong> {statistics.slopeDistance}m</p>
                                <p><strong>Minimalna visina:</strong> {statistics.minHeight}m</p>
                                <p><strong>Maksimalna visina:</strong> {statistics.maxHeight}m</p>
                                <p><strong>Razlika visine:</strong> {statistics.heightDifference}m</p>
                            </div>
                            )}
                            {/* <TrackStats points={track.points} longitude_multiplier={params.heightmap.width / params.multiplier} latitude_multiplier={params.heightmap.height / params.multiplier}, heightmap={params.heightmap}></TrackStats> */}
                        </section>
                    </Card>
                </Popup>
            }
        </>
    );
}