export class FormattedError {

  public error: any;
  public error_code: string;
  public description: string;

  constructor(props: FormattedError) {
    this.error = props.error;
    this.error_code = props.error_code;
    this.description = props.description;
  }

}