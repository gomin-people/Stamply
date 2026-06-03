import { formatPhoneNumber } from "@/utils";

describe("formatPhoneNumber", () => {
  describe("02 지역번호 (서울)", () => {
    it("숫자 2자리 이하는 하이픈 없이 반환한다", () => {
      expect(formatPhoneNumber("02")).toBe("02");
    });

    it("6자리 이하는 02-XXXX 형식으로 반환한다", () => {
      expect(formatPhoneNumber("021234")).toBe("02-1234");
    });

    it("02-XXXX-XXX (9자리) 형식으로 포매팅한다", () => {
      expect(formatPhoneNumber("021234567")).toBe("02-123-4567");
    });

    it("02-XXX-XXXX (9자리) 형식으로 포매팅한다", () => {
      expect(formatPhoneNumber("023334444")).toBe("02-333-4444");
    });

    it("02-XXXX-XXXX (10자리) 형식으로 포매팅한다", () => {
      expect(formatPhoneNumber("0212345678")).toBe("02-1234-5678");
    });

    it("11자리 초과 숫자는 10자리로 잘라낸다", () => {
      expect(formatPhoneNumber("021234567890")).toBe("02-1234-5678");
    });

    it("하이픈이 포함된 입력도 올바르게 포매팅한다", () => {
      expect(formatPhoneNumber("02-1234-5678")).toBe("02-1234-5678");
    });
  });

  describe("3자리 지역번호 (국번 3자리, 총 10자리)", () => {
    it("042-481-4833 패턴을 올바르게 포매팅한다", () => {
      expect(formatPhoneNumber("0424814833")).toBe("042-481-4833");
    });

    it("하이픈이 포함된 입력도 올바르게 포매팅한다", () => {
      expect(formatPhoneNumber("042-481-4833")).toBe("042-481-4833");
    });
  });

  describe("3자리 지역번호 (국번 4자리, 총 11자리)", () => {
    it("010-1234-5678 패턴을 올바르게 포매팅한다", () => {
      expect(formatPhoneNumber("01012345678")).toBe("010-1234-5678");
    });

    it("042-4814-4833 패턴을 올바르게 포매팅한다", () => {
      expect(formatPhoneNumber("04248144833")).toBe("042-4814-4833");
    });

    it("11자리 초과 숫자는 11자리로 잘라낸다", () => {
      expect(formatPhoneNumber("010123456789")).toBe("010-1234-5678");
    });

    it("하이픈이 포함된 입력도 올바르게 포매팅한다", () => {
      expect(formatPhoneNumber("010-1234-5678")).toBe("010-1234-5678");
    });
  });

  describe("입력 중 중간 상태", () => {
    it("3자리 이하는 하이픈 없이 반환한다", () => {
      expect(formatPhoneNumber("010")).toBe("010");
    });

    it("7자리 이하는 XXX-XXXX 형식으로 반환한다", () => {
      expect(formatPhoneNumber("0101234")).toBe("010-1234");
    });
  });
});
