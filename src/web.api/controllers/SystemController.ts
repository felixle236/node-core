import * as path from 'path';
import { ContentType, Get, JsonController, Res } from 'routing-controllers';
import { Service } from 'typedi';
import { readFile } from '../../libs/file';

@Service()
@JsonController('/v1/systems')
export class SystemController {
    // Demo API download file binary
    @Get('/export-pdf')
    @ContentType('application/octet-stream')
    exportPDF(@Res() res): Promise<Buffer> {
        const filePath = path.join(__dirname, '../../resources/documents/sample.pdf');
        res.set('Content-disposition', 'attachment; filename=sample.pdf');
        return readFile(filePath);
    }
}
