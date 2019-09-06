import React, { memo } from "react";

const round = Math.round;
const PR = round( window.devicePixelRatio || 1 );

const WIDTH = 80 * PR, HEIGHT = 48 * PR,
    TEXT_X = 3 * PR, TEXT_Y = 2 * PR,
    GRAPH_X = 3 * PR, GRAPH_Y = 15 * PR,
    GRAPH_WIDTH = 74 * PR, GRAPH_HEIGHT = 30 * PR;

const StatsPanel = React.forwardRef(({ name, fg, bg, iteration, isActive }, ref) => {
    const [min, setMin] = React.useState(Infinity);
    const [max, setMax] = React.useState(0);
    const canvas = React.useRef(null);

    React.useImperativeHandle(ref, () => ({
        update(value, maxValue) {
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

    React.useEffect(() => {
        if(!canvas.current) return;

        canvas.current.width = WIDTH;
        canvas.current.height = HEIGHT;

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

    return <canvas style={{ display: isActive ? 'block' : 'none', width: 80, height: 48 }} ref={canvas}/>
});

const panelsData = [
    {
        id: 0,
        name: 'FPS',
        fg: '#0ff',
        bg: '#002',
        isActive: true,
        iteration: { value: 0, maxValue: 0 },
        ref: 'fpsPanelRef'
    },
    {
        id: 1,
        name: 'MS',
        fg: '#0f0',
        bg: '#020',
        isActive: false,
        iteration: { value: 0, maxValue: 0 },
        ref: 'msPanelRef'
    },
    self.performance && self.performance.memory && {
        id: 2,
        name: 'MB',
        fg: '#f08',
        bg: '#201',
        isActive: false,
        iteration: { value: 0, maxValue: 0 },
        ref: 'mbPanelRef'
    },
].filter(Boolean);

const Stats = memo(() => {
    const [mode, setMode] = React.useState(0);
    const [panels, setPanels] = React.useState(panelsData);
    const [beginTime , setBeginTime] = React.useState(( performance || Date ).now());
    const [prevTime , setPrevTime] = React.useState(( performance || Date ).now());
    const [frames, setFrames] = React.useState(0);
    const fpsPanelRef = React.useRef(null);
    const msPanelRef = React.useRef(null);
    const mbPanelRef = React.useRef(null);
    const refs = { fpsPanelRef, msPanelRef, mbPanelRef };

    const showPanel = id => {
        setPanels(panels =>
            panels.map(panel => panel.id === id
                ? { ...panel, isActive: true }
                : { ...panel, isActive: false }
            )
        );
        setMode(id)
    };

    const tick = () => {
        setFrames(frames => frames + 1);
            const time = ( performance || Date ).now();

            refs.msPanelRef.current.update( time - beginTime, 200);

            if ( time >= prevTime + 1000 ) {
                refs.fpsPanelRef.current.update(  ( frames * 1000 ) / ( time - prevTime ), 100);

                setPrevTime(time);
                setFrames(0);

                if (  refs.fpsPanelRef.current ) {
                    const memory = performance.memory;
                    refs.fpsPanelRef.current.update(memory.usedJSHeapSize / 1048576, memory.jsHeapSizeLimit / 1048576)
                }
            }

        setBeginTime(time);
        requestAnimationFrame(tick);
    };

    React.useEffect(() => {
        requestAnimationFrame(tick);
    }, []);

    const changePanel = () => {
        showPanel(mode % panels.length);
        setMode(mode => mode + 1);
    };

    return (
        <div onClick={changePanel} style={{ position: 'fixed', top: 0, left: 0, cursor: 'pointer', opacity: 0.9, zIndex: 90000 }}>
            { panels.map(panel =>
                <StatsPanel
                    ref={refs[panel.ref]}
                    isActive={panel.isActive}
                    key={panel.id}
                    name={panel.name}
                    fg={panel.fg}
                    bg={panel.bg}
                    iteration={panel.iteration}
                />
            )}
        </div>
    )
});

export default Stats;
