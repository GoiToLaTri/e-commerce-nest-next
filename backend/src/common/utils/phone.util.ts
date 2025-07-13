import {
  PhoneNumber,
  PhoneNumberFormat,
  PhoneNumberUtil,
} from 'google-libphonenumber';

class PhoneUtil {
  private phoneUtil: PhoneNumberUtil;
  private PNF: typeof PhoneNumberFormat;

  constructor() {
    this.phoneUtil = PhoneNumberUtil.getInstance();
    this.PNF = PhoneNumberFormat;
  }

  parseStringToPhone(phoneNumber: string): PhoneNumber {
    const parsePhone: PhoneNumber =
      this.phoneUtil.parseAndKeepRawInput(phoneNumber);
    return parsePhone;
  }

  isPhone(phoneNumber: string): boolean {
    try {
      const parsePhone = this.parseStringToPhone(phoneNumber.trim());
      return this.phoneUtil.isValidNumber(parsePhone);
    } catch (error) {
      return false;
    }
  }

  phoneFormat(phoneNumber: string): string {
    const parsePhone: PhoneNumber = this.parseStringToPhone(phoneNumber);
    const phoneFormated = this.phoneUtil.format(
      parsePhone,
      this.PNF.INTERNATIONAL,
    );

    return phoneFormated;
  }
}

export const phoneUtil = new PhoneUtil();
