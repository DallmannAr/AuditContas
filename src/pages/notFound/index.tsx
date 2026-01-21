
import { Button } from "@/components/ui/button";

//Library imports
import { Forward } from "lucide-react";
import { useNavigate } from "react-router-dom";

import image404 from "@/assets/notFound.svg"

export default function NotFoundScreen() { 

    const navigate = useNavigate();

    return(
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center max-w-80 text-center gap-2">
              <img src={image404} alt="Mascote crocodilo triste" className="w-60 mb-4" />

                <h1 className="text-8xl font-extrabold text-foreground"> 404</h1>    
                <p className="text-xl text-muted-foreground"> Ops! Parece que você se perdeu. Use a busca ou volte para a página inicial </p>
                <Button onClick={() => navigate('/home')}  className="mt-5"> Voltar para a home <Forward />  </Button>
            </div>        
        </div>
    );
};