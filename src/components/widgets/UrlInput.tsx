import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Label } from "../ui/label";

const UrlInput = () => {
  return (
    <div className="grid w-full max-w-sm gap-6">
      <Label htmlFor="input-secure-19" className="sr-only">
        Input Secure
      </Label>
      <InputGroup>
        <InputGroupInput />
        <InputGroupAddon className="text-muted-foreground placeholder:text-muted-foreground font-normal pl-3">
          https://
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
};

export default UrlInput;
