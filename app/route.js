import {ImageResponse} from "next/og";
export const runtime="edge";
function clean(v=""){return String(v).replace(/^@/,"").replace(/[^A-Za-z0-9_]/g,"").slice(0,15)||"yourhandle";}
export async function GET(request){
  const {searchParams}=new URL(request.url); const h=clean(searchParams.get("u")); const avatar=`https://unavatar.io/x/${encodeURIComponent(h)}`;
  return new ImageResponse(
    <div style={{width:"1200px",height:"630px",display:"flex",position:"relative",overflow:"hidden",background:"linear-gradient(90deg,#24313b 0%,#15b7ba 10%,#ef7047 20%,#111 28%,#11b7bc 35%,#ef6b47 45%,#111 55%,#15b9bd 65%,#ef754b 75%,#111 85%,#18b8bc 100%)",fontFamily:"Arial"}}>
      <div style={{position:"absolute",left:"42px",top:"34px",width:"520px",height:"270px",background:"#fff",color:"#000",padding:"18px 22px",display:"flex",flexDirection:"column"}}>
        <div style={{display:"flex",fontSize:"64px",fontWeight:900,lineHeight:.88,letterSpacing:"-4px"}}>I’m not going to</div>
        <div style={{display:"flex",fontSize:"64px",fontWeight:900,lineHeight:.88,letterSpacing:"-4px"}}>Sui Basecamp</div>
        <div style={{display:"flex",fontSize:"72px",fontWeight:900,lineHeight:.88,letterSpacing:"-4px"}}>2026</div>
        <div style={{display:"flex",fontSize:"24px",marginTop:"12px"}}>with TOKEN2049</div>
      </div>
      <div style={{position:"absolute",right:"42px",top:"34px",width:"430px",height:"430px",background:"linear-gradient(145deg,#df6ed6,#a33096)",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
        <img src={avatar} width="300" height="400" style={{objectFit:"cover"}}/>
      </div>
      <div style={{position:"absolute",right:"42px",bottom:"42px",width:"430px",height:"56px",display:"flex",alignItems:"center",padding:"0 14px",background:"rgba(59,55,49,.88)",color:"#fff",fontSize:"34px",fontWeight:800}}>@{h}</div>
    </div>,
    {width:1200,height:630}
  );
}
