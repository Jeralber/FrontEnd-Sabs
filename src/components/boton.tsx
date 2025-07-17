import {Button} from "@heroui/react";
type ButtonProps = {
  hola: string;
}
const Boton: React.FC<ButtonProps> = ({ hola }) => {
  return (
    <Button className="bg-red-600 hover:bg-blue-700">
      {hola}
    </Button>
  );
}
export default Boton;