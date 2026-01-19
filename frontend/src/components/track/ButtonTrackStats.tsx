import './ButtonTrackStats.css';
import Button from "../general/Button.js";
import List from '../general/List.js';
import Card from '../general/Card.js';
import Popup from '../general/Popup.js';
import { useState, useEffect, useRef } from "react";
import type Track from "../../interfaces/Track.js";
import { Chart } from 'chart.js/auto';
import { generateChartData, calculateTrackStatistics } from './TrackUtils.js';

interface Props {
    track: Track;
}

export default function ButtonTrackStats({ track }: Props) {
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
                <Popup onClick={() => {setStats(false)}}>
                    <Card>
                        <header>
                            <List type='row' gap='medium' align='center' justify="space-between" expand>
                                <h2>Statistike staze</h2>
                                <Button type='tertiary' onClick={() => {setStats(false)}} shape="noshape">
                                    <i className='fa fa-times fa-2x'></i>
                                </Button>
                            </List>
                        </header>
                        <section className="-button-track-stats">
                            <div style={{ width: '80vw', maxWidth: '1000px', minWidth: '300px', aspectRatio: '2' }}>
                                <canvas ref={canvasRef} ></canvas>
                            </div>
                            {statistics && (
                                <List gap="small" type="column" wrap>
                                    <List align="center" justify='space-between' expand>
                                        <p><i className="fa fa-list-ol"></i> Broj točaka</p>
                                        <samp>{statistics.numPoints}</samp>
                                    </List>
                                    <List align="center" justify='space-between' expand>
                                        <p><i className="fa fa-arrows-h"></i> Horizontalna udaljenost</p>
                                        <samp>{statistics.horizontalDistance}m</samp>
                                    </List>
                                    <List align="center" justify='space-between' expand>
                                        <p><i className="fa fa-line-chart"></i> Udaljenost s nagibom</p>
                                        <samp>{statistics.slopeDistance}m</samp>
                                    </List>
                                    <List align="center" justify='space-between' expand>
                                        <p><i className="fa fa-chevron-up"></i> Maksimalna visina</p>
                                        <samp>{statistics.maxHeight}m</samp>
                                    </List>
                                    <List align="center" justify='space-between' expand>
                                        <p><i className="fa fa-chevron-down"></i> Minimalna visina</p>
                                        <samp>{statistics.minHeight}m</samp>
                                    </List>
                                    <List align="center" justify='space-between' expand>
                                        <p><i className="fa fa-arrows-v"></i> Razlika visine</p>
                                        <samp>{statistics.heightDifference}m</samp>
                                    </List>
                                </List>
                            )}
                        </section>
                    </Card>
                </Popup>
            }
        </>
    );
}