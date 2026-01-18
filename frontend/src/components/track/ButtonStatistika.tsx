import Button from "../general/Button";
import List from '../general/List.js';
import Card from '../general/Card.js';
import Popup from '../general/Popup.js';
import { useState, useEffect, useRef } from "react";
import type Track from "../../interfaces/Track";
import { Chart } from 'chart.js/auto';
import { generateChartData, calculateTrackStatistics } from './TrackUtils.js';

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

        

        const data = generateChartData(track);
        setChartData(data);

        chartRef.current = new Chart(canvasRef.current, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Visina',
                    data: data,
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


    

    const statistics = stats ? calculateTrackStatistics(chartData) : null;



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