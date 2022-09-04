import { useResponseContext } from "../contexts/ResponseContext";
import { useThemeContext } from "../contexts/ThemeContext";
import { AnyContextType } from "../types";
import { Config } from "../utils/config.class";
import { Theme } from "../utils/theme.class";
import { ICommand } from "./ICommand";

export function InitializeColorCommand() : ICommand {
    const mainColorContext: AnyContextType = useThemeContext();
    const responseContext: AnyContextType = useResponseContext();
    return new ColorCommand(mainColorContext, responseContext)
}

export class ColorCommand implements ICommand{
    public name: string = "color";
    public params?: string[] = [ "fg", "bg", "both" ];
    private startsWithParams?: string[] = [ "f", "b" ];
    private mainColorContext: AnyContextType;
    private responseContext: AnyContextType;

    private readonly InvalidColorMessage = "Invalid color code. Please provide a valid color code.";
    private readonly InvalidParameterMessage = "Invalid parameter. Valid parameters are: fg, bg, both";
   
    constructor(mainColorContext: AnyContextType, responseContext: AnyContextType) {
        this.mainColorContext = mainColorContext;
        this.responseContext = responseContext;
    }

    public execute(parameters: string) {
        let args: string[] = parameters.split(' ');
        let type: string = args[0];
        if (!this.params?.includes(type) || !this.startsWithParams?.includes(type[0]))
            return this.setResponseState("Error", this.InvalidParameterMessage);

        let color: string = args[1];
        
        if (color === undefined || color === "")
            return this.setResponseState("Error", "");

        var colorOption = new Option().style;
        colorOption.color = color;

        if (colorOption.color === "")
            return this.setResponseState("Error", this.InvalidColorMessage);
        
        let config = new Config();
        let theme = new Theme(this.mainColorContext, this.responseContext);
        let colors = config.getParsedConfig("themeColors");

        if (type === "fg" || type.startsWith("f") || type === "both")
            theme.updateColors(color, colors?.foreground);

        if (type === "both")
        {
            color = args[2];
            if (color === undefined || color === "")
                return this.setResponseState("Error", this.InvalidColorMessage);

            colorOption.color = color;

            if (colorOption.color === "")
                return this.setResponseState("Error", this.InvalidColorMessage);
        }
        
        if (type === "bg" || type.startsWith("b") || type === "both")
            theme.updateColors(colors?.background, color);
        
        this.setResponseState("Error", "Color updated successfully.");
    };

    setResponseState(message?: string, error?: string) {
        this.responseContext.setResponseState({ lineText: " " + message?.toUpperCase(), outputText: error });
    }

    public help() {
        
    };

    public description?: string = "Change the color of the terminal.";
    public usage?: string = "color <fg|bg|both> <color> <color?>";
    public hidden?: boolean = false;
    public admin?: boolean = false;
}