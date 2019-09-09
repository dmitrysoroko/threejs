import React, { memo, forwardRef, useState, useRef, useImperativeHandle, useEffect, useCallback, useMemo } from "react";

const round = Math.round,
    PR = round(window.devicePixelRatio || 1),
    WIDTH = 80 * PR, HEIGHT = 48 * PR,
    TEXT_X = 3 * PR, TEXT_Y = 2 * PR,
    GRAPH_X = 3 * PR, GRAPH_Y = 15 * PR,
    GRAPH_WIDTH = 74 * PR, GRAPH_HEIGHT = 30 * PR;

const StatsPanel = memo(forwardRef(({ name, fg, bg, iteration, isActive }, ref) => {
    const [min, setMin] = useState(Infinity);
    const [max, setMax] = useState(0);
    const canvas = useRef(null);

    useImperativeHandle(ref, () => ({
        update: (value, maxValue) => {
            if(!canvas.current) return;
            setMin(Math.min( min, value ));
            setMax(Math.max( max, value ));

            const context = canvas.current.getContext("2d");
            context.fillStyle = bg;
            context.globalAlpha = 1;
            context.fillRect( 0, 0, WIDTH, GRAPH_Y );
            context.fillStyle = fg;
            context.fillText( round( value ) + ' ' + name + ' (' + round( min ) + '-' + round( max ) + ')', TEXT_X, TEXT_Y );

            context.drawImage( canvas.current, GRAPH_X + PR, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT, GRAPH_X, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT );

            context.fillRect( GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT );

            context.fillStyle = bg;
            context.globalAlpha = 0.9;
            context.fillRect( GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, round( ( 1 - ( value / maxValue ) ) * GRAPH_HEIGHT ) );
        }
    }));

    useEffect(() => {
        if(!canvas.current) return;
        const context = canvas.current.getContext( '2d' );
        context.font = 'bold ' + ( 9 * PR ) + 'px Helvetica,Arial,sans-serif';
        context.textBaseline = 'top';

        context.fillStyle = bg;
        context.fillRect( 0, 0, WIDTH, HEIGHT );

        context.fillStyle = fg;
        context.fillText( name, TEXT_X, TEXT_Y );
        context.fillRect( GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT );

        context.fillStyle = bg;
        context.globalAlpha = 0.9;
        context.fillRect( GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT );
    }, [canvas.current]);

    return <canvas style={{ display: isActive ? 'block' : 'none' }} width={80} height={48} ref={canvas}/>
}));

const panels = [
    { id: 0, name: 'FPS', fg: '#0ff', bg: '#002', ref: 'fpsPanelRef' },
    { id: 1, name: 'MS', fg: '#0f0', bg: '#020', ref: 'msPanelRef' },
    self.performance && self.performance.memory && { id: 2, name: 'MB', fg: '#f08', bg: '#201', ref: 'mbPanelRef' },
].filter(Boolean);

const Stats = memo(() => {
    const Data = useRef({ beginTime: (performance || Date).now(), prevTime: (performance || Date).now(), frames: 0 });
    const [activePanelId, setActivePanelId] = useState(0);
    const fpsPanelRef = useRef(null);
    const msPanelRef = useRef(null);
    const mbPanelRef = useRef(null);
    const refs = useMemo(() => ({ fpsPanelRef, msPanelRef, mbPanelRef }), []);

    const tick = useCallback(() => {
        Data.current.frames++;
        const time = (performance || Date).now();
        refs.msPanelRef.current.update(time - Data.current.beginTime, 200);
        if (time >= Data.current.prevTime + 1000) {
            refs.fpsPanelRef.current.update((Data.current.frames * 1000) / (time - Data.current.prevTime), 100);
            Data.current.prevTime = time;
            Data.current.frames = 0;
            if (refs.mbPanelRef.current) {
                const memory = performance.memory;
                refs.mbPanelRef.current.update(memory.usedJSHeapSize / 1048576, memory.jsHeapSizeLimit / 1048576)
            }
        }
        Data.current.beginTime = time;
        requestAnimationFrame(tick);
    }, []);

    useEffect(() => {
        requestAnimationFrame(tick);
    }, []);

    const changePanel = useCallback(() => {
        setActivePanelId(activePanelId => (activePanelId + 1) % panels.length);
    }, []);

    return (
        <div onClick={changePanel} style={{ cursor: 'pointer' }}>
            { panels.map(panel =>
                <StatsPanel
                    key={panel.id}
                    ref={refs[panel.ref]}
                    isActive={activePanelId === panel.id}
                    name={panel.name}
                    fg={panel.fg}
                    bg={panel.bg}
                />
            )}
        </div>
    )
});

export default Stats;
