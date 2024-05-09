"use client";

import {useRef} from "react";
import {
    motion,
    useScroll,
    useSpring,
    useTransform,
    MotionValue,
} from "framer-motion";
import Hero from "@/components/views/lading/hero";
import Info from "@/components/views/lading/info";
import Support from "@/components/views/lading/support";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {ApolloWrapper} from "./ApolloWrapper";
import {Provider} from 'react-redux';
import {store} from '@/utils/redux/store';

function useParallax(value: MotionValue<number>, distance: number) {
    return useTransform(value, [0, 1], [-distance, distance]);
}

function Section({children}: { children: React.ReactNode }) {
    return (
        <section className=" flex items-center justify-center">
            <div>
                {children}
            </div>
        </section>
    );
}

export default function Home() {
    const divRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef(null);
    const {scrollYProgress} = useScroll({target: scrollRef});
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    let stages = [

        <Hero/>,
        <Info/>,
        <Support/>,
        <Footer/>
    ];

    return (
        <ApolloWrapper>
            <Provider store={store}>
                <main className="flex min-h-screen flex-col items-center justify-between ">

                    <div ref={scrollRef} className=" overflow-x-clip overflow-y-scroll hide-scroll-bar">
                        {stages.map((stage, index) => (
                            <Section key={index}>
                                {stage}
                            </Section>
                        ))}
                    </div>
                </main>
            </Provider>
        </ApolloWrapper>
    );
}
