import { Button } from "@quotes/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@quotes/ui/dialog";

export default function Page(): React.ReactElement {
        return (
                <Dialog>
                        <DialogTrigger asChild><Button>Open Dialog</Button></DialogTrigger>
                        <DialogContent className="gap-0 p-0">
                                <DialogHeader className="p-4 pb-4">
                                        <DialogTitle>Episode Title</DialogTitle>
                                        <DialogDescription>Episode Description</DialogDescription>
                                </DialogHeader>
                                <div>
                                        <img src="https://picsum.photos/1920/1080" />
                                </div>
                        </DialogContent>
                </Dialog>
        );
}
