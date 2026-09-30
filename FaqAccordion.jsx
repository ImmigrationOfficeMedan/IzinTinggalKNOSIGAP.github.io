import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

const FaqAccordion = ({ items = [] }) => {
    if (!items.length) {
        return (
            <p className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
                Belum ada pertanyaan yang tercatat untuk bagian ini.
            </p>
        );
    }
    return (
        <Accordion type="single" collapsible className="w-full">
            {items.map((item, i) => (
                <AccordionItem key={item.id || i} value={`faq-${item.id || i}`} className="border-border">
                    <AccordionTrigger className="text-left text-[15px] font-semibold text-navy hover:text-navy-light">
                        {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                        {item.answer}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
};

export default FaqAccordion;
