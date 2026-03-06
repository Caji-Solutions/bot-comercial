import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export function FloatingActionButton() {
    const location = useLocation();
    const navigate = useNavigate();

    // Show only on the landing page '/'
    if (location.pathname !== '/') {
        return null;
    }

    return (
        <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[9999]">
            <div className="relative">
                {/* Tag "grátis" */}
                <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    style={{ rotate: 12 }}
                    className="absolute -top-3 -right-2 bg-[#00A947] text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md z-10 border-2 border-[#1E293B]"
                >
                    GRÁTIS
                </motion.div>

                {/* Button */}
                <Button
                    onClick={() => navigate('/sua-experiencia')}
                    className="bg-[#F97316] hover:bg-[#EA580C] text-white border-2 border-[#1E293B] font-bold px-6 py-6 md:px-8 md:py-7 text-base md:text-lg rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-transform hover:scale-105"
                >
                    Testar Agora
                </Button>
            </div>
        </div>
    );
}
